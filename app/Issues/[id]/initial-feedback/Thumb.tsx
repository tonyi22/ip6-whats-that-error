'use client';
import React, { useState } from 'react';
import { FaThumbsUp } from "react-icons/fa";
import { FaThumbsDown } from "react-icons/fa";

type ThumbsComponentProps = {
    rating: number;
    onChange: (rating: number) => void;
};

const ThumbsComponent: React.FC<ThumbsComponentProps> = ({ rating, onChange }) => {
    const [hover, setHover] = useState(0);

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaThumbsUp
                style={{
                    cursor: 'pointer',
                    color: hover === 1 || rating === 1 ? 'yellow' : 'gray',
                    fontSize: '24px',
                    marginRight: '10px'
                }}
                onMouseEnter={() => setHover(1)}
                onMouseLeave={() => setHover(0)}
                onClick={() => onChange(1)}
            />
            <FaThumbsDown
                style={{
                    cursor: 'pointer',
                    color: hover === -1 || rating === -1 ? 'yellow' : 'gray',
                    fontSize: '24px',
                    fill: hover === -1 || rating === -1 ? 'yellow' : 'gray'
                }}
                onMouseEnter={() => setHover(-1)}
                onMouseLeave={() => setHover(0)}
                onClick={() => onChange(-1)}
            />
        </div>
    );
};

export default ThumbsComponent;
