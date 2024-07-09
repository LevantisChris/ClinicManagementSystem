import React from 'react';
import {motion} from "framer-motion";


export default function ActiveHoursModal({onClose}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
            <div className="w-6/12 bg-white shadow-2xl p-5 relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-600">Close</button>
                {/* Add your modal content here */}
            </div>
        </motion.div>
    );
}