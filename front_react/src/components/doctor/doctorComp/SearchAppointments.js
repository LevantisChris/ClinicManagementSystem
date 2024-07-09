import React from 'react';

export default function SearchAppointments({onChange, placeholder}) {
    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission if needed
        console.log('Form submitted');
    };

    return (
        <div className="grid grid-rows-2 border w-screen">
            {/* Search Bar */}
            <form onSubmit={handleSubmit} className={"h-min"}>
                {/* Filters must be inserted here */}
                <div className="m-2 relative">
                    <input
                        type="text"
                        onChange={onChange}
                        placeholder={placeholder}
                        className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none w-72"
                    />
                </div>
            </form>

            {/* Results */}
            <div className="m-2">
                Results will go here
            </div>
        </div>
    );
}
