'use client';
import React, { useState } from 'react';

type SternComponentProps = {
    rating: number;
    onChange: (rating: number) => void;
};

const SternComponent: React.FC<SternComponentProps> = ({ rating, onChange }) => {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex justify-center">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;

                return (
                    <span
                        key={index}
                        style={{
                            cursor: 'pointer',
                            fontSize: '24px',
                            color: ratingValue <= (hover || rating) ? '#FFD700' : 'transparent',
                            WebkitTextStroke: '1px black',
                            display: 'inline-block',
                        }}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => onChange(ratingValue)}
                    >
                        ★
                    </span>
                );
            })}
        </div>
    );
};

export default SternComponent;
