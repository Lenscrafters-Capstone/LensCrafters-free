import * as React from 'react';
import { MantineProvider, createTheme, Container, Flex, Title, Text, Grid, Stack, Divider, NumberInput, Button } from '@mantine/core';
import { VisualizeOptionsPage } from './visualizeOptionsPage';
import { Header } from '../components/header'
import metal_frames from '../resources/metal_frames.jpeg'
import { PrescriptionSelect } from '../components/prescriptionSelect';
import { AxisInput } from '../components/axisInput';
import { LensFrameSelection } from './lensFrameSelection';
import round_metal_preview from '../resources/round_metal_preview.png'
import wayfarer_ease_preview from '../resources/wayfarer_ease_preview.png'
import aviator_preview from '../resources/aviator_preview.png'
import '@fontsource/inter';
import { StepperBar } from '../components/stepperBar';

export function HomePage() {


  const [sphOD, setSphOD] = React.useState('0.00');
  const [cylOD, setCylOD] = React.useState('0.00');
  const [axisOD, setAxisOD] = React.useState('0.00');
  const [sphOS, setSphOS] = React.useState('0.00');
  const [cylOS, setCylOS] = React.useState('0.00');
  const [axisOS, setAxisOS] = React.useState('0.00');
  const [pd, setPD] = React.useState(63);
  const [currentView, setCurrentView] = React.useState('home');
  const [prescription, setPrescription] = React.useState({});

  const glassMaterials = ['Crown Glass - 1.52', 'Flint Glass - 1.6'];
  const plasticMaterials = ['Standard Plastic - 1.5', 'Polycarbonate - 1.59', 'High-index Plastic - 1.57', 'High-index Plastic - 1.67', 'High-index Plastic - 1.74'];
  const [material, setMaterial] = React.useState(plasticMaterials[0]);
  const [frameID, setFrameID] = React.useState(0);

  // stepper state
  const [active, setActive] = React.useState(0);

  const frames = [
    {
      id: 'ray_ban_round_metal',
      src: round_metal_preview,
      name: 'Ray Ban Round Metal',
      material: 'Metal'
    },
    {
      id: 'ray_ban_wayfarer_ease',
      src: wayfarer_ease_preview,
      name: 'Ray Ban Wayfarer Ease',
      material: 'Propionate'
    },
    {
      id: 'ray_ban_aviator_classic',
      src: aviator_preview,
      name: 'Ray Ban Aviator Classic',
      material: 'Metal'
    }
  ]

  const backgroundStyle = {
    backgroundImage: `url(${metal_frames})`,
    backgroundSize: '50% auto',
    backgroundPosition: 'right 0 top 2em',
    backgroundRepeat: 'no-repeat'
  };

  async function handleContinue() {
    setCurrentView('lensFrameSelection')
    setPrescription({ SPH_OD: sphOD, SPH_OS: sphOS, CYL_OD: cylOD, CYL_OS: cylOS, AXIS_OD: axisOD, AXIS_OS: axisOS, PD: pd });
    setActive(1)
  }

  const renderHomePage = () => {
    // eslint-disable-next-line default-case
    switch (currentView) {
      case 'home':
        return (
          <div style={backgroundStyle} h='100%'>
            <Header setCurrentView={setCurrentView} />
            <Flex direction='column' pt='3em' pl='3em' pr='45%' gap='1em' >
              <Text fz='xl' fw='500'>Discover your ideal lens and frame match today!</Text>
              <Text fz='lg' fs="italic" pt='1.5em'>Get started now:</Text>
              <StepperBar active={active}></StepperBar>
              <Title order={1}>Prescription</Title>
              <Container ml='0' pl='2em' w='60em' h='auto' justify='flex-start'>
                <Grid>
                  <Grid.Col span={1} pt='3.25em'>
                    <Stack gap='0'>
                      <Text fz='md' fw='250'>OD</Text>
                      <Text lh='0.5' fz='xs' fw='250'>(Right)</Text>
                    </Stack>
                    <Stack gap='0' pt='1.35em'>
                      <Text fz='md' fw='250'>OS</Text>
                      <Text lh='0.5' fz='xs' fw='250'>(Left)</Text>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Stack gap='0.5em'>
                      <Text fz='md' fw='250'>Sphere (SPH)</Text>
                      <PrescriptionSelect data={sphOD} setData={setSphOD}></PrescriptionSelect>
                      <PrescriptionSelect data={sphOS} setData={setSphOS}></PrescriptionSelect>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Stack gap='0.5em'>
                      <Text fz='md' fw='250'>Cylinder (CYL)</Text>
                      <PrescriptionSelect data={cylOD} setData={setCylOD}></PrescriptionSelect>
                      <PrescriptionSelect data={cylOS} setData={setCylOS}></PrescriptionSelect>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Stack gap='0.5em'>
                      <Text fz='md' fw='250'>Axis</Text>
                      <AxisInput data={axisOD} setData={setAxisOD} sph={sphOD} cyl={cylOD}></AxisInput>
                      <AxisInput data={axisOS} setData={setAxisOS} sph={sphOS} cyl={cylOS}></AxisInput>
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Container>
              <Divider mt='3em' size='xs' w='50em' />

              <Title order={1} pt='1em'>PD (Pupillary distance)</Title>
              <NumberInput
                pt='0.5em'
                label=''
                w='10em'
                defaultValue={63}
                min={50}
                max={80}
                value={pd}
                onChange={(value) => setPD(value)} />
              <Button mt='2em' h='3em' w='10em' onClick={handleContinue}>Continue</Button>
            </Flex>
          </div>
        )
      case 'lensFrameSelection':
        return <LensFrameSelection prescription={prescription} setCurrentView={setCurrentView}
          material={material} setMaterial={setMaterial} plasticMaterials={plasticMaterials} glassMaterials={glassMaterials}
          frameID={frameID} setFrameID={setFrameID} frames={frames}
          active={active} setActive={setActive}></LensFrameSelection>
      case 'visualizeOptions':
        return <VisualizeOptionsPage prescription={prescription} material={material}
          frameName={frames.find(frame => frame.id === frameID).name}
          setCurrentView={setCurrentView}
          active={active} setActive={setActive}></VisualizeOptionsPage>
    }
  }

  return (
    <MantineProvider theme={theme}>
      {renderHomePage()}
    </MantineProvider>
  );

}

const theme = createTheme({
  primaryColor: 'muteBlue',
  fontFamily: 'Inter, sans-serif',
  fontSizes: {
    xs: '0.5em',
    sm: '0.875em',
    md: '1em',
    lg: '1.5em',
    xl: '1.75em'
  },
  headings: {
    fontFamily: 'Jomolhari',
    sizes: {
      h1: { fontWeight: '300', fontSize: '1.25em' },
      h2: { fontWeight: '200', fontSize: '1.5em' }
    },
  },
  colors: {
    'muteBlue': [
      '#ecf6ff',
      '#dee8f1',
      '#bfcedc',
      '#9cb3c8',
      '#7f9db6',
      '#6c8eac',
      '#6287a8',
      '#507493',
      '#446785',
      '#335a77'
    ]
  }
});