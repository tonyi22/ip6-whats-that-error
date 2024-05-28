'use client'
import React, { useState } from 'react';
import { systemMonitoringIssuesArray } from '../../page';
import '../detailView.css';
import { getAlertIcon, getSeverityColor } from '@/app/helperFunction';
import SliderComponent from './Slider';
import SternComponent from './Stern';
import ThumbComponent from './Thumb';
import TextBoxComponent from './Textbox';
import EmojiComponent from './Emoji';
import CheckboxComponent from './Checkbox';

type RatingComponentProps = {
    onChange: (rating: number) => void;
};

const RatingComponent: React.FC<RatingComponentProps> = ({ onChange }) => {
    return (
        <div>
            {[...Array(5)].map((_, i) => (
                <span key={i} onClick={() => onChange(i + 1)} style={{ cursor: 'pointer', color: '#ffd700' }}>★</span>
            ))}
        </div>
    );
};

export function Feedback({ params }: { params: { id: string } }) {
    const issue = systemMonitoringIssuesArray.find(issue => issue.id === Number(params.id))!;
    const [sliderRating, setSliderRating] = useState(2);
    const [starRating, setStarRating] = useState(0);
    const [thumbsRating, setThumbsRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState('');
    const [emojiRating, setEmojiRating] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const checkboxOptions = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

    return (
        <div className="max-w-3xl mx-auto my-10 bg-github-tertiary dark:bg-github-dark-background text-black dark:text-github-dark-text">
            <h3 className="px-10 py-10 text-5xl font-semibold flex justify-center items-center">Evaluate Issue</h3>

            <div className="p-4">
                <div className="grid grid-cols-2 gap-4 space-y-2">
                    <div className="flex flex-col  p-4 space-y-3">
                        <h2 className="font-bold">Title:</h2>
                        <p>{issue.title}</p>
                    </div>
                    <div className="flex flex-col items-center p-4 space-y-3">
                        <h2 className="font-bold">Rate Title:</h2>
                        <SliderComponent
                            value={sliderRating}
                            onChange={setSliderRating}
                            min={0}
                            max={5}
                        />
                        <SternComponent rating={starRating} onChange={setStarRating} />
                        <ThumbComponent rating={thumbsRating} onChange={setThumbsRating} />
                        <TextBoxComponent value={feedbackText} onChange={setFeedbackText} />
                        <EmojiComponent rating={emojiRating} onChange={setEmojiRating} />
                        <CheckboxComponent options={checkboxOptions} selectedOptions={selectedOptions} onChange={setSelectedOptions} />
                    </div>

                    <div className="flex flex-col p-4 space-y-3">
                        <h2 className="font-bold">Alert Icon</h2>
                        {getAlertIcon(issue.alertType)}
                    </div>
                    <div className="flex flex-col items-center p-4 space-y-3">
                        <h2 className="font-bold">Rate Alert Icon:</h2>
                        <RatingComponent onChange={(rating) => console.log('Alert Icon Rating:', rating)} />
                    </div>

                    <div className="flex flex-col p-4 space-y-3">
                        <h2 className="font-bold">Severity</h2>
                        <div className="flex-none">
                            <span className={`${getSeverityColor(issue.severity)} rounded-xl p-2`}>{issue.severity}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center p-4 space-y-3">
                        <h2 className="font-bold">Rate Severity:</h2>
                        <RatingComponent onChange={(rating) => console.log('Severity Rating:', rating)} />
                    </div>

                    <div className="flex flex-col p-4 space-y-3">
                        <h2 className="font-bold">Status</h2>
                        <div className="flex-none">
                            <span className='bg-gray-200 dark:bg-gray-500 rounded-xl p-2'>{issue.status}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center p-4 space-y-3">
                        <h2 className="font-bold">Rate Status:</h2>
                        <RatingComponent onChange={(rating) => console.log('Status Rating:', rating)} />
                    </div>

                    <div className="flex flex-col p-4 space-y-3">
                        <h2 className="font-bold">Incident Type</h2>
                        <div className="flex-none">
                            <span className='bg-gray-200 dark:bg-gray-500 rounded-xl p-2'>{issue.incidentType}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center p-4 space-y-3">
                        <h2 className="font-bold">Rate Incident type:</h2>
                        <RatingComponent onChange={(rating) => console.log('Incident Type Rating:', rating)} />
                    </div>

                    <div className="flex flex-col p-4 space-y-3">
                        <h2 className="font-bold">Priority</h2>
                        <div className="flex-none">
                            <span className='bg-gray-200 dark:bg-gray-500 rounded-xl p-2'>{issue.priority}/10</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center p-4 space-y-3">
                        <h2 className="font-bold">Rate Priority:</h2>
                        <RatingComponent onChange={(rating) => console.log('Priority Rating:', rating)} />
                    </div>

                    <div className="flex flex-col p-4 space-y-3">
                        <h2 className="font-bold">Description</h2>
                        <div className="flex-none"></div>
                        <div className='bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md min-h-250px] col-span-1 row-span-1 p-4'>
                            <p>{issue.description}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center p-4 space-y-3">
                        <h2 className="font-bold">Rate description:</h2>
                        <RatingComponent onChange={(rating) => console.log('Description Rating:', rating)} />
                    </div>

                    <div className="flex flex-col p-4 space-y-3">
                        <h2 className="font-bold">Affected Systems</h2>
                        <div className="flex-none">
                            <div className='bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md min-h-250px] col-span-1 row-span-1 p-4'>
                                <div className="space-y-1">
                                    {issue.affectedSystems.map((system, index) => (
                                        <p key={index}> - {system}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center p-4 space-y-3">
                        <h2 className="font-bold">Rate Affected Systems:</h2>
                        <RatingComponent onChange={(rating) => console.log('Affected Systems Rating:', rating)} />
                    </div>

                    <div className="flex flex-col p-4 space-y-3">
                        <h2 className="font-bold">Impact</h2>
                        <div className="flex-none">
                            <div className='bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md min-h-250px] col-span-1 row-span-1 p-4'>
                                <p className='p-1'> - {issue.impact}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center p-4 space-y-3">
                        <h2 className="font-bold">Rate Impact:</h2>
                        <RatingComponent onChange={(rating) => console.log('Impact Rating:', rating)} />
                    </div>

                    <div className="flex flex-col p-4 space-y-3">
                        <h2 className="font-bold">Preventative Measures</h2>
                        <div className='bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md min-h-250px] col-span-1 row-span-1 p-4'>
                            <p className='p-1'> - {issue.preventativeMeasures}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center p-4 space-y-3">
                        <h2 className="font-bold">Rate Preventative Measures:</h2>
                        <RatingComponent onChange={(rating) => console.log('Preventative Measures Rating:', rating)} />
                    </div>

                    {/* Neue Sektion für spezifische Fragen zur Feedback-Qualität */}
                    <div className="flex flex-col p-4 space-y-3">
                        <h2 className="font-bold">Feedback-Qualität</h2>
                        <div className="flex flex-col space-y-2">
                            <p>War das Feedbackgeben verständlich?</p>
                            <div className="flex space-x-4">
                                <label>
                                    <input type="radio" name="understandable" value="yes" /> Ja
                                </label>
                                <label>
                                    <input type="radio" name="understandable" value="no" /> Nein
                                </label>
                            </div>
                            <textarea placeholder="Wenn Nein, bitte beschreiben..." className="w-full p-2"></textarea>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <p>War das gegebene Feedback hilfreich?</p>
                            <div className="flex space-x-4">
                                <label>
                                    <input type="radio" name="helpful" value="yes" /> Ja
                                </label>
                                <label>
                                    <input type="radio" name="helpful" value="no" /> Nein
                                </label>
                            </div>
                            <textarea placeholder="Wenn Nein, bitte beschreiben..." className="w-full p-2"></textarea>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <p>Wusstest du, was zu tun ist, um das Issue zu lösen?</p>
                            <div className="flex space-x-4">
                                <label>
                                    <input type="radio" name="whatToDo" value="yes" /> Ja
                                </label>
                                <label>
                                    <input type="radio" name="whatToDo" value="no" /> Nein
                                </label>
                            </div>
                            <textarea placeholder="Wenn Nein, bitte beschreiben..." className="w-full p-2"></textarea>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <p>Hast du den Lösungsvorschlag umgesetzt?</p>
                            <div className="flex space-x-4">
                                <label>
                                    <input type="radio" name="implemented" value="yes" /> Ja
                                </label>
                                <label>
                                    <input type="radio" name="implemented" value="no" /> Nein
                                </label>
                            </div>
                            <textarea placeholder="Wenn Nein, bitte beschreiben..." className="w-full p-2"></textarea>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <p>Wie hast du das Issue gelöst?</p>
                            <div className="flex space-x-4">
                                <label>
                                    <input type="radio" name="implemented" value="yes" /> Ja
                                </label>
                                <label>
                                    <input type="radio" name="implemented" value="no" /> Nein
                                </label>
                            </div>
                            <textarea placeholder="Wenn Nein, bitte beschreiben..." className="w-full p-2"></textarea>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <p>Ist das Problem gelöst?</p>
                            <div className="flex space-x-4">
                                <label>
                                    <input type="radio" name="solved" value="yes" /> Ja
                                </label>
                                <label>
                                    <input type="radio" name="solved" value="no" /> Nein
                                </label>
                            </div>
                            <textarea placeholder="Wenn Nein, bitte beschreiben..." className="w-full p-2"></textarea>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <p>Ist das Issue wirklich gelöst?</p>
                            <input type="text" placeholder="Status" className="w-full p-2" />
                            <textarea placeholder="Kommentare zur Nachverfolgung..." className="w-full p-2"></textarea>
                        </div>
                    </div>

                    {/* Neue Sektion für Fragen zur Benutzerfreundlichkeit des Feedback-Formulars */}
                    <div className="flex flex-col p-4 space-y-3">
                        <h2 className="font-bold">Benutzerfreundlichkeit des Feedback-Formulars</h2>
                        <div className="flex flex-col space-y-2">
                            <p>War das Feedback-Formular einfach zu verstehen?</p>
                            <div className="flex space-x-4">
                                <label>
                                    <input type="radio" name="formUnderstandable" value="yes" /> Ja
                                </label>
                                <label>
                                    <input type="radio" name="formUnderstandable" value="no" /> Nein
                                </label>
                            </div>
                            <textarea placeholder="Wenn Nein, bitte beschreiben..." className="w-full p-2"></textarea>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <p>War das Feedback-Formular einfach zu nutzen?</p>
                            <div className="flex space-x-4">
                                <label>
                                    <input type="radio" name="formEasyToUse" value="yes" /> Ja
                                </label>
                                <label>
                                    <input type="radio" name="formEasyToUse" value="no" /> Nein
                                </label>
                            </div>
                            <textarea placeholder="Wenn Nein, bitte beschreiben..." className="w-full p-2"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Feedback;
