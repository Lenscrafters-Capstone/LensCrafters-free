import * as React from 'react';
import { Container, Flex, Title, Text, Grid, Stack, Divider, NumberInput, Button } from '@mantine/core';
import { Header } from '../components/header'
import metal_frames from '../resources/metal_frames.jpeg'
import { PrescriptionSelect } from '../components/prescriptionSelect';
import { AxisInput } from '../components/axisInput';
import { StepperBar } from '../components/stepperBar';
import { AppStateContext } from './AppStateContext';
import { useNavigate, useLocation } from 'react-router-dom';

export function respondToBrowserState(location) {
  if (location.pathname.includes('select-lens-frame')) return 1;
  if (location.pathname.includes('visualize-options')) return 2;
  return 0;
}

export function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    setActive(respondToBrowserState(location));
  });

  const {
    sphOD, setSphOD,
    cylOD, setCylOD,
    axisOD, setAxisOD,
    sphOS, setSphOS,
    cylOS, setCylOS,
    axisOS, setAxisOS,
    pd, setPD,
    setPrescription,
    active, setActive,
  } = React.useContext(AppStateContext);

  const [isAxisODValid, setAxisODValid] = React.useState(true);
  const [isAxisOSValid, setAxisOSValid] = React.useState(true);


  const backgroundStyle = {
    backgroundImage: `url(${metal_frames})`,
    backgroundSize: '50% auto',
    backgroundPosition: 'right 0 top 2em',
    backgroundRepeat: 'no-repeat'
  };

  async function handleContinue() {
    const newSphOD = sphOD || '0.00';
    const newCylOD = cylOD || '0.00';
    const newAxisOD = axisOD || '0.00';
    const newSphOS = sphOS || '0.00';
    const newCylOS = cylOS || '0.00';
    const newAxisOS = axisOS || '0.00';

    setSphOD(newSphOD);
    setCylOD(newCylOD);
    setAxisOD(newAxisOD);
    setSphOS(newSphOS);
    setCylOS(newCylOS);
    setAxisOS(newAxisOS);

    setPrescription({
      SPH_OD: newSphOD, SPH_OS: newSphOS,
      CYL_OD: newCylOD, CYL_OS: newCylOS,
      AXIS_OD: newAxisOD, AXIS_OS: newAxisOS,
      PD: pd
    });

    setActive(1);
    navigate('/select-lens-frame');
  }

  return (
    <div style={backgroundStyle} h='100%'>
      <Header />
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
                <AxisInput data={axisOD} setData={setAxisOD} sph={sphOD} cyl={cylOD} isValid={isAxisODValid} setValid={setAxisODValid}></AxisInput>
                <AxisInput data={axisOS} setData={setAxisOS} sph={sphOS} cyl={cylOS} isValid={isAxisOSValid} setValid={setAxisOSValid}></AxisInput>
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
          value={pd}
          onChange={(value) => setPD(value)}
          error={(pd > 68 || pd < 54) && "Please enter a value within the accepted range of 54mm to 68mm."} />
        <Button mt='2em' h='3em' w='10em' onClick={handleContinue} disabled={!isAxisODValid || !isAxisOSValid || (pd > 68 || pd < 54)} >Continue</Button>
        {(!isAxisODValid || !isAxisOSValid || (pd > 68 || pd < 54)) &&
          <Text size='sm' c='gray'>Please enter valid values to proceed.</Text>
        }
      </Flex>
    </div>
  )
}