'use client';
import { useState, ChangeEvent, FormEvent } from 'react';

interface FeedbackModalProps {
    onSubmit: (responses: FeedbackResponses) => void;
    onClose: () => void;
}

interface FeedbackResponses {
    issueClear: string;
    problemUnderstood: string;
    stepsKnown: string;
    infoMissing: string;
    issueClearDetails: string;
    problemUnderstoodDetails: string;
    stepsKnownDetails: string;
    infoMissingDetails: string;
}

function FeedbackModal({ onSubmit, onClose }: FeedbackModalProps) {
    const [responses, setResponses] = useState<FeedbackResponses>({
        issueClear: '',
        problemUnderstood: '',
        stepsKnown: '',
        infoMissing: '',
        issueClearDetails: '',
        problemUnderstoodDetails: '',
        stepsKnownDetails: '',
        infoMissingDetails: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setResponses(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(responses);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <style jsx>{`
                .custom-radio {
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                    display: inline-block;
                    width: 0.75em; 
                    height: 0.75em; 
                    border-radius: 50%;
                    border: 1px solid #000;
                    cursor: pointer;
                    position: relative;
                    top: 0.15em;
                    margin-right: 0.05em;
                    background-color: white; 
                }
                .custom-radio:checked {
                    background-color: #4299e1; 
                    border-color: #000; 
                }
            `}</style>
            <div className="bg-gradient-to-b from-[#fcf1fa] to-[#fefcff] p-8 rounded-lg shadow-md w-full max-w-lg">
                <h3 className="text-2xl font-bold mb-4">Feedback Form</h3>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4 mb-4 border p-4 rounded-lg bg-white">
                        <label>Ist die Beschreibung des Issues klar?</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="issueClear"
                                    value="yes"
                                    className="custom-radio"
                                    onChange={handleChange}
                                />
                                <span className="ml-2">Ja</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="issueClear"
                                    value="no"
                                    className="custom-radio"
                                    onChange={handleChange}
                                />
                                <span className="ml-2">Nein</span>
                            </label>
                        </div>
                        {responses.issueClear === 'no' && (
                            <textarea
                                name="issueClearDetails"
                                onChange={handleChange}
                                placeholder="Was war nicht klar?"
                                className="editable-input mt-2"
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-4 border p-4 rounded-lg bg-white">
                        <label>Hast du sofort verstanden, was das Problem ist?</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="problemUnderstood"
                                    value="yes"
                                    className="custom-radio"
                                    onChange={handleChange}
                                />
                                <span className="ml-2">Ja</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="problemUnderstood"
                                    value="no"
                                    className="custom-radio"
                                    onChange={handleChange}
                                />
                                <span className="ml-2">Nein</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="problemUnderstood"
                                    value="teilweise"
                                    className="custom-radio"
                                    onChange={handleChange}
                                />
                                <span className="ml-2">Teilweise</span>
                            </label>
                        </div>
                        {(responses.problemUnderstood === 'no' || responses.problemUnderstood === 'teilweise') && (
                            <textarea
                                name="problemUnderstoodDetails"
                                onChange={handleChange}
                                placeholder="Was hast du nicht verstanden?"
                                className="editable-input mt-2"
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-4 border p-4 rounded-lg bg-white">
                        <label>Wusstest du, welche Schritte zur Lösung des Issues erforderlich sind?</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="stepsKnown"
                                    value="yes"
                                    className="custom-radio"
                                    onChange={handleChange}
                                />
                                <span className="ml-2">Ja</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="stepsKnown"
                                    value="no"
                                    className="custom-radio"
                                    onChange={handleChange}
                                />
                                <span className="ml-2">Nein</span>
                            </label>
                        </div>
                        {responses.stepsKnown === 'no' && (
                            <textarea
                                name="stepsKnownDetails"
                                onChange={handleChange}
                                placeholder="Bitte beschreiben..."
                                className="editable-input mt-2"
                            />
                        )}
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FeedbackModal;
