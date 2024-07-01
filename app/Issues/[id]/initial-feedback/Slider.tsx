'use client';
import React from 'react';

type SliderComponentProps = {
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
};

const SliderComponent: React.FC<SliderComponentProps> = ({ value, onChange, min, max }) => {
    const ticks = [];
    for (let i = min; i <= max; i++) {
        ticks.push(i);
    }

    return (
        <div style={{ width: '75%' }}>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                style={{
                    width: '100%',
                    margin: '10px 0',
                    appearance: 'none',
                    height: '5px',
                    borderRadius: '5px',
                    background: '#ddd',
                    outline: 'none',
                    opacity: '0.7',
                    transition: 'opacity .2s',
                }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 5px' }}>
                {ticks.map(tick => (
                    <span key={tick} style={{ fontSize: '12px' }}>{tick}</span>
                ))}
            </div>
        </div>
    );
};

export default SliderComponent;
