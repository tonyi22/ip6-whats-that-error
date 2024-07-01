'use client';
import React from 'react';

type CheckboxComponentProps = {
    options: string[];
    selectedOptions: string[];
    onChange: (selectedOptions: string[]) => void;
};

const CheckboxComponent: React.FC<CheckboxComponentProps> = ({ options, selectedOptions, onChange }) => {
    const handleCheckboxChange = (option: string) => {
        if (selectedOptions.includes(option)) {
            onChange(selectedOptions.filter((selected) => selected !== option));
        } else {
            onChange([...selectedOptions, option]);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {options.map((option) => (
                <label key={option} style={{ marginBottom: '8px' }}>
                    <input
                        type="checkbox"
                        value={option}
                        checked={selectedOptions.includes(option)}
                        onChange={() => handleCheckboxChange(option)}
                        style={{ marginRight: '8px' }}
                    />
                    {option}
                </label>
            ))}
        </div>
    );
};

export default CheckboxComponent;
