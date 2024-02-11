import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Button, Flex } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useGLTF } from '@react-three/drei';
import occluderUrl from '../resources/head_occluders.glb';
import { AppStateContext } from '../pages/AppStateContext';
import { setFaceFollowers, setThreeFiber, getThreeFiber } from './helper/JeelizStartup.js'
import * as THREE from 'three';

// import main script and neural network model from Jeeliz FaceFilter NPM package
import { JEELIZFACEFILTER } from 'facefilter'

// import THREE.js helper, useful to compute pose
// The helper is not minified, feel free to customize it (and submit pull requests bro):
import { JeelizThreeFiberHelper } from './helper/JeelizThreeFiberHelper.js'

const Occluder = () => {
    const gltf = useGLTF(occluderUrl, true);

    useEffect(() => {
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                console.log(child.renderOrder);
                // Make each mesh in the occluder invisible but still affect the depth buffer
                child.material = new THREE.MeshBasicMaterial({
                    colorWrite: false
                });
            }
        });
    }, [gltf.scene]);

    return <primitive object={gltf.scene} />;
};

// This mesh follows the face. put stuffs in it.
// Its position and orientation is controlled by Jeeliz THREE.js helper
const FaceFollower = (props) => {
    // This reference will give us direct access to the mesh
    const glassesRef = useRef()
    const occluderRef = useRef()
    const objRef = useRef()
    const { scene } = useGLTF(props.modelUrl);

    useEffect(() => {
        setFaceFollowers(props.faceIndex, objRef.current);
        scene.traverse((child) => {
            if (child.isMesh) {
                child.renderOrder = 1;
            }
        });
    });

    // Adjust this to fit the model to the face correctly
    const modelScale = props.frameName === "Ray Ban Aviator Classic" ? 8.3 : 8.7;
    const modelPositionOffset = [0, 0.4, 0.7]; // x, y, z
    const occluderScale = 0.12;
    const occluderPositionOffset = [0, -0.25, 0.75]; // x, y, z

    useFrame(() => {
        if (glassesRef.current) {
            glassesRef.current.scale.set(modelScale, modelScale, modelScale);
            glassesRef.current.position.set(...modelPositionOffset);
        }
        if (occluderRef.current) {
            occluderRef.current.scale.set(occluderScale, occluderScale, occluderScale);
            occluderRef.current.position.set(...occluderPositionOffset);
        }
    })

    return (
        <object3D ref={objRef}>
            <group ref={occluderRef} renderOrder={0}>
                <Occluder />
            </group>
            <group ref={glassesRef} renderOrder={1}>
                <primitive object={scene} />
                <directionalLight
                    color={0xffffff} // Light color
                    intensity={10} // Brightness
                    position={[0, 0, 5]} // Position in [x, y, z] format
                />
            </group>
        </object3D>
    )
}

// fake component, display nothing
// just used to get the Camera and the renderer used by React-fiber:
const ThreeGrabber = (props) => {
    setThreeFiber(useThree());
    const sizing = {
        height: document.getElementById('jeeFaceFilterCanvas').offsetHeight,
        width: document.getElementById('jeeFaceFilterCanvas').offsetWidth, top: 0, left: 0
    };
    props.setActualSizing(sizing);
    useFrame(JeelizThreeFiberHelper.update_camera.bind(null, props.actualSizing, getThreeFiber().camera));
    return null
}

const compute_sizing = () => {
    // Compute the size of the canvas as a percentage of the window size
    const height = window.innerHeight * (50 / 100);
    const width = window.innerWidth * (50 / 100);

    // Compute the position of the canvas to center it
    const top = 0;
    const left = 0;

    return { width, height, top, left };
};

export const TryOnViewer = (props) => {
    const navigate = useNavigate();

    const [sizing, setSizing] = useState(compute_sizing())
    const [actualSizing, setActualSizing] = useState(compute_sizing())
    const { isReady } = React.useContext(AppStateContext);

    let _timerResize = null
    const handle_resize = () => {
        // do not resize too often:
        if (_timerResize) {
            clearTimeout(_timerResize)
        }
        _timerResize = setTimeout(do_resize, 200)
    }

    const do_resize = () => {
        _timerResize = null
        const newSizing = compute_sizing()
        setSizing(newSizing)
    }


    useEffect(() => {
        if (isReady && !_timerResize) {
            JEELIZFACEFILTER.resize()
        }
    })

    useEffect(() => {
        const canvas = document.getElementById('jeeFaceFilterCanvas');
        if (isReady && props.opened) {
            JEELIZFACEFILTER.toggle_pause(false);
            props.modalRef.current.insertBefore(canvas, props.modalRef.current.firstChild);
            if (canvas) {
                canvas.style.display = 'block'; // Show the canvas
                canvas.width = sizing.width;  // Update width
                canvas.height = sizing.height; // Update height
            }
        } else if (isReady) {
            JEELIZFACEFILTER.toggle_pause(true);
            canvas.style.display = 'none';
            document.body.appendChild(canvas); // Move it back to the body
        }
    });

    useEffect(() => {
        window.addEventListener('resize', handle_resize)
        window.addEventListener('orientationchange', handle_resize)
    })

    return (
        <Flex>
            <Canvas
                className='mirrorFeed'
                style={{
                    zIndex: 2,
                    ...actualSizing,
                    position: 'absolute'
                }}
                gl={{
                    preserveDrawingBuffer: true
                }}
            >
                <ThreeGrabber actualSizing={actualSizing} setActualSizing={setActualSizing} />
                <FaceFollower faceIndex={0} modelUrl={props.modelUrl} />
            </Canvas>
            <Flex align='center' justify='space-between' bg='#e0ddd7' h='4em' w='100%' gap='sm' px='1em'>
                <Text size='sm' fs='italic' padding='1em'>Lens material: {props.material}</Text>
                <Flex align='center' gap='md'>
                    <Text size='sm' padding='1em'>{props.frameName}</Text>
                    <Button variant='light' onClick={() => {
                        const canvas = document.getElementById('jeeFaceFilterCanvas');
                        canvas.style.display = 'none';
                        document.body.appendChild(canvas);
                        navigate('/select-lens-frame');
                    }}>Change Selection</Button>
                </Flex>
            </Flex>
        </Flex>
    )
}