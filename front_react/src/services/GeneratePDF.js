import jsPDF from 'jspdf';

class GeneratePDF {
    static createPDF(patientUsername, jsonData) {
        const doc = new jsPDF();
        const lineHeight = 10; // Height of each line
        const pageHeight = doc.internal.pageSize.height; // Height of the page
        const pageWidth = doc.internal.pageSize.width; // Width of the page
        const margin = 10; // Margin from the left edge of the page
        let yOffset = 30; // Initial Y position, leaving space for the title

        let pdfBlob;

        const addNewPageIfNeeded = () => {
            if (yOffset + lineHeight > pageHeight) {
                doc.addPage();
                yOffset = 10; // Reset Y position for the new page
            }
        };

        if (Array.isArray(jsonData)) {

            console.log("HERE: ", jsonData)

            doc.text("Patient History for: " + patientUsername, margin, yOffset);
            yOffset += lineHeight + 10; // Move Y position down

            jsonData.forEach((item, index) => {
                doc.text(`Registration ${index + 1}:`, margin, yOffset);
                yOffset += lineHeight;
                addNewPageIfNeeded();

                Object.keys(item).forEach((key) => {
                    let text;
                    if(key === "appointment")
                        text = `RelevantAppointmentDate: ${item[key].appointmentDate}`;
                    else if(key === "patientHistoryRegistrationDateRegister")
                        text = `RegistrationDate&Time: ${item[key].split("T")[0]} at ${item[key].split("T")[1]}`
                    else
                        text = `${key}: ${item[key]}`;

                    const splitText = doc.splitTextToSize(text, pageWidth - 2 * margin);
                    splitText.forEach(line => {
                        doc.text(line, margin + 5, yOffset);
                        yOffset += lineHeight;
                        addNewPageIfNeeded();
                    });
                });

                yOffset += lineHeight;
                addNewPageIfNeeded();
            });

            pdfBlob = doc.output('blob');
        } else { // The jsonData is not an array, only an object
            doc.text("Patient Registration for: " + patientUsername, margin, yOffset);
            yOffset += lineHeight;

            Object.keys(jsonData).forEach((key) => {
                let text;
                if(key === "appointment")
                    text = `RelevantAppointmentDate: ${jsonData[key].appointmentDate}`;
                else if(key === "patientHistoryRegistrationDateRegister")
                    text = `RegistrationDate&Time: ${jsonData[key].split("T")[0]} at ${jsonData[key].split("T")[1]}`
                else
                    text = `${key}: ${jsonData[key]}`;
                const splitText = doc.splitTextToSize(text, pageWidth - 2 * margin);
                splitText.forEach(line => {
                    doc.text(line, margin, yOffset);
                    yOffset += lineHeight;
                    addNewPageIfNeeded();
                });
            });

            pdfBlob = doc.output('blob');
        }

        const link = document.createElement('a');
        link.href = URL.createObjectURL(pdfBlob);
        if(Array.isArray(jsonData))
            link.download = `${patientUsername}History`;
        else
            link.download = `${patientUsername}Registration`;

        // Automatically click the link to trigger the download
        link.click();
        URL.revokeObjectURL(link.href);
    }



}

export default GeneratePDF;
