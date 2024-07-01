'use client';
import React, { useState } from 'react';

type EmojiComponentProps = {
    rating: number;
    onChange: (rating: number) => void;
};

const emojis = ['😡', '😞', '😐', '😊', '😍'];

const EmojiComponent: React.FC<EmojiComponentProps> = ({ rating, onChange }) => {
    const [hover, setHover] = useState(0);

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {emojis.map((emoji, index) => {
                const ratingValue = index + 1;
                return (
                    <span
                        key={index}
                        style={{
                            cursor: 'pointer',
                            fontSize: '24px',
                            margin: '0 5px',
                            color: ratingValue <= (hover || rating) ? 'orange' : 'gray'
                        }}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => onChange(ratingValue)}
                    >
                        {emoji}
                    </span>
                );
            })}
        </div>
    );
};

export default EmojiComponent;
