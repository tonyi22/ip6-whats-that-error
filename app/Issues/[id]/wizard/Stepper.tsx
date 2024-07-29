import React from 'react';

interface StepperProps {
    steps: string[];
    currentStep: number;
    onStepClick: (step: number) => void;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onStepClick }) => {
    return (
        <div className="stepper">
            <div className="steps text-xs active-step">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className={`step ${currentStep === index ? 'active' : ''}`}
                        onClick={() => onStepClick(index)} // Make steps clickable
                    >
                        {step}
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Stepper;
