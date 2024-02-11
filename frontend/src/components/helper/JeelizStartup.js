import { useEffect } from 'react';

// import main script and neural network model from Jeeliz FaceFilter NPM package
import { JEELIZFACEFILTER, NN_4EXPR } from 'facefilter'

// import THREE.js helper, useful to compute pose
// The helper is not minified, feel free to customize it (and submit pull requests bro):
import { JeelizThreeFiberHelper } from './JeelizThreeFiberHelper.js'
import { getIsJeelizInit, setJeelizInit } from '../../index.js';

const _faceFollowers = new Array(1)
export const getFaceFollowers = () => _faceFollowers;
export const setFaceFollowers = (faceIndex, objRef) => {
    _faceFollowers[faceIndex] = objRef;
};

let _threeFiber = null
export const getThreeFiber = () => _threeFiber;
export const setThreeFiber = (value) => {
    _threeFiber = value;
};
export const useJeelizStartup = (setReady, tryOnClicked) => {
    useEffect(() => {
        const callbackDetect = (faceIndex, isDetected) => {
            if (isDetected) {
                console.log('DETECTED')
            } else {
                console.log('LOST')
            }
        }

        const callbackReady = (errCode, spec) => {
            if (errCode) {
                console.log('AN ERROR HAPPENS. ERR =', errCode)
                return
            }
            setReady(true)
            console.log('INFO: JEELIZFACEFILTER IS READY')
            // there is only 1 face to track, so 1 face follower:
            JeelizThreeFiberHelper.init(spec, _faceFollowers, callbackDetect)
        }

        const callbackTrack = (detectStatesArg) => {
            // if 1 face detection, wrap in an array:
            const detectStates = (detectStatesArg.length) ? detectStatesArg : [detectStatesArg]

            // update video and THREE faceFollowers poses:
            JeelizThreeFiberHelper.update(detectStates, _threeFiber.camera)
            JEELIZFACEFILTER.resize()
            // render the video texture on the faceFilter canvas:
            JEELIZFACEFILTER.render_video()
        }
        
        if (!getIsJeelizInit() && tryOnClicked){
            JEELIZFACEFILTER.init({
                canvasId: 'jeeFaceFilterCanvas',
                NNC: NN_4EXPR,
                maxFacesDetected: 1,
                followZRot: true,
                callbackReady,
                callbackTrack
            });
            setJeelizInit(true);
        }

        return () => {
        };
    });
};