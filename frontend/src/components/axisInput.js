import * as React from 'react';
import { NumberInput } from '@mantine/core';

export function AxisInput(props) {

    return (
        <NumberInput
            pt='0.5em'
            label=''
            defaultValue={0}
            min={0} max={180}
            placeholder={0}
            value={props.data}
            error={!props.isValid && "Axis must be between 0 and 180."}
            disabled={(props.sph === '0.00' && props.cyl === '0.00')}
            onChange={(value) => {
                (value < 0 || value >180) ? props.setValid(false) : props.setValid(true)
                props.setData(value)}
             } />
    );
}