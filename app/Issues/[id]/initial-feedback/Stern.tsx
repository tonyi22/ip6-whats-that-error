'use client';
import React, { useState } from 'react';

type SternComponentProps = {
    rating: number | null;
    onChange: (rating: number) => void;
};

const SternComponent: React.FC<SternComponentProps> = ({ rating, onChange }) => {
    const [hover, setHover] = useState<number | null>(null);

    return (
        <div>
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;

                return (
                    <span
                        key={index}
                        style={{
                            cursor: 'pointer',
                            fontSize: '24px',
                            color: ratingValue <= (hover || rating || 0) ? '#FFD700' : 'transparent',
                            WebkitTextStroke: '1px black',
                            display: 'inline-block',
                        }}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(null)}
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
