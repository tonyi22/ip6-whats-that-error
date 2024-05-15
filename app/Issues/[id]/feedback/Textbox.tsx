'use client';
import React from 'react';

type TextBoxComponentProps = {
    value: string;
    onChange: (value: string) => void;
};

const TextBoxComponent: React.FC<TextBoxComponentProps> = ({ value, onChange }) => {
    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your feedback here..."
            style={{
                width: '100%',
                height: '100px',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '16px',
                resize: 'vertical',
                color: 'black',
            }}
        />
    );
};

export default TextBoxComponent;
