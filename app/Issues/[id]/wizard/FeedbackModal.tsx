'use client';
import { useTranslation } from '@/app/TranslationContext';
import { useState, ChangeEvent, FormEvent } from 'react';

interface FeedbackModalProps {
    onSubmit: (responses: FeedbackResponses) => void;
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

function FeedbackModal({ onSubmit }: FeedbackModalProps) {
    const { translate } = useTranslation();
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
        if (!responses.issueClearDetails || !responses.problemUnderstood || !responses.stepsKnown) {
            alert(translate('pleaseFillOutAllRequiredFields'));
            return;
        }
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
                <h3 className="text-2xl font-bold mb-4">Wizard Feedback</h3>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4 mb-4 border p-4 rounded-lg bg-white">
                        <label>{translate("issueDescriptionClear")}</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="issueClear"
                                    value="yes"
                                    className="custom-radio"
                                    onChange={handleChange}
                                    required
                                />
                                <span className="ml-2">{translate("yes")}</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="issueClear"
                                    value="no"
                                    className="custom-radio"
                                    onChange={handleChange}
                                    required
                                />
                                <span className="ml-2">{translate("no")}</span>
                            </label>
                        </div>
                        {responses.issueClear === 'no' && (
                            <textarea
                                name="issueClearDetails"
                                onChange={handleChange}
                                placeholder={translate("whatWasUnclear")}
                                className="editable-input mt-2"
                                required
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-4 border p-4 rounded-lg bg-white">
                        <label>{translate("problemUnderstanding")}</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="problemUnderstood"
                                    value="yes"
                                    className="custom-radio"
                                    onChange={handleChange}
                                    required
                                />
                                <span className="ml-2">{translate("yes")}</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="problemUnderstood"
                                    value="no"
                                    className="custom-radio"
                                    onChange={handleChange}
                                    required
                                />
                                <span className="ml-2">{translate("no")}</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="problemUnderstood"
                                    value="teilweise"
                                    className="custom-radio"
                                    onChange={handleChange}
                                    required
                                />
                                <span className="ml-2">{translate("partially")}</span>
                            </label>
                        </div>
                        {(responses.problemUnderstood === 'no' || responses.problemUnderstood === 'teilweise') && (
                            <textarea
                                name="problemUnderstoodDetails"
                                onChange={handleChange}
                                placeholder={translate("whatDidntYouUnderstand")}
                                className="editable-input mt-2"
                                required
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-4 border p-4 rounded-lg bg-white">
                        <label>{translate("requiredStepsKnowledge")}</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="stepsKnown"
                                    value="yes"
                                    className="custom-radio"
                                    onChange={handleChange}
                                    required
                                />
                                <span className="ml-2">{translate("yes")}</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="stepsKnown"
                                    value="no"
                                    className="custom-radio"
                                    onChange={handleChange}
                                    required
                                />
                                <span className="ml-2">{translate("no")}</span>
                            </label>
                        </div>
                        {responses.stepsKnown === 'no' && (
                            <textarea
                                name="stepsKnownDetails"
                                onChange={handleChange}
                                placeholder={translate("pleaseDescribe")}
                                className="editable-input mt-2"
                                required
                            />
                        )}
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            {translate("submit")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FeedbackModal;
