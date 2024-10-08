import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useRef } from 'react';
import { classNames } from '../helperFunction';
import { useTranslation } from '../TranslationContext';
import Link from 'next/link';


// Custom drop down element 
function CustomDropDown({ id, initialFeedback }: { id: number, initialFeedback: boolean }) {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const { translate } = useTranslation();

    const openMenuProgrammatically = (e: { stopPropagation: () => void; }) => {
        e.stopPropagation();
        buttonRef.current?.click();
    };

    return (
        <Menu as="div" className="relative inline-block text-left" >
            <div className="relative">
                <MenuButton
                    ref={buttonRef}
                    className="inline-flex w-full p-2 justify-center rounded-md bg-white text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ChevronDownIcon className="w-5 text-gray-400" aria-hidden="true" />
                    {!initialFeedback && (
                        <span
                            className="absolute top-0 right-0 mt-1 mr-1 w-2.5 h-2.5 bg-blue-500 rounded-full"
                            onClick={openMenuProgrammatically}
                        ></span>
                    )}
                </MenuButton>
            </div>

            <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
                <div className="py-1">
                    {!initialFeedback &&
                        <MenuItem>
                            {({ focus }) => (
                                <Link
                                    href={`/Issues/${id}/initial-feedback`}
                                    className={classNames(focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm')}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {translate("giveInitial")}
                                    <span className="inline-block ml-2 w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                                </Link>
                            )}
                        </MenuItem>

                    }
                    <MenuItem>
                        {({ focus }) => (
                            <Link
                                href={`/Issues/ticket`}
                                className={classNames(focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm')}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {translate('openTicket')}
                            </Link>
                        )}
                    </MenuItem>
                </div>
            </MenuItems>
        </Menu>
    )
}

export default CustomDropDown;
