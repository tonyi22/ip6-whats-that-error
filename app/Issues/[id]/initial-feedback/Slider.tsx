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
        <div className="w-full">
            <style jsx>{`
                input[type='range'] {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 100%;
                    height: 5px;
                    border-radius: 5px;
                    background: #ddd;
                    outline: none;
                    opacity: 0.7;
                    transition: opacity .2s;
                }
                input[type='range']::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 15px;
                    height: 15px;
                    border-radius: 50%;
                    background: #3979EC; 
                    border: 1px solid #000;
                    cursor: pointer;
                }
                input[type='range']::-moz-range-thumb {
                    width: 15px;
                    height: 15px;
                    border-radius: 50%;
                    background: #4299e1; 
                    cursor: pointer;
                }
            `}</style>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
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
