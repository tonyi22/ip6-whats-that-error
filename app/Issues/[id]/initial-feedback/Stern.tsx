'use client';
import React, { useState } from 'react';

type SternComponentProps = {
    rating: number;
    onChange: (rating: number) => void;
};

const SternComponent: React.FC<SternComponentProps> = ({ rating, onChange }) => {
    const [hover, setHover] = useState(2);

    return (
        <div>
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;

                return (
                    <span
                        key={index}
                        style={{
                            cursor: 'pointer',
                            color: ratingValue <= (hover || rating) ? 'yellow' : 'gray',
                            fontSize: '24px'
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
