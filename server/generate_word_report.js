
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun, AlignmentType } = require('docx');

// Image paths (using the ones we captured)
const imagePaths = {
    home: 'C:/Users/dell/.gemini/antigravity/brain/32162098-0511-4354-9cfe-004e84dd1b2d/01_home_page_1763655684162.png',
    dashboard: 'C:/Users/dell/.gemini/antigravity/brain/32162098-0511-4354-9cfe-004e84dd1b2d/02_user_dashboard_1763655811710.png',
    quiz: 'C:/Users/dell/.gemini/antigravity/brain/32162098-0511-4354-9cfe-004e84dd1b2d/07_quiz_question_final_1763656117148.png',
    admin: 'C:/Users/dell/.gemini/antigravity/brain/32162098-0511-4354-9cfe-004e84dd1b2d/03_admin_dashboard_final_1763656071306.png'
};

function createImage(path, width = 500, height = 300) {
    try {
        const imageBuffer = fs.readFileSync(path);
        return new Paragraph({
            children: [
                new ImageRun({
                    data: imageBuffer,
                    transformation: {
                        width: width,
                        height: height,
                    },
                }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
        });
    } catch (e) {
        console.error(`Could not read image at ${path}:`, e);
        return new Paragraph({
            children: [new TextRun({ text: "[Image missing]", color: "FF0000" })]
        });
    }
}

const doc = new Document({
    sections: [{
        properties: {},
        children: [
            new Paragraph({
                text: "Cloud-Based Quiz Application - Project Report",
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
                spacing: { after: 300 },
            }),

            // 1. Executive Summary
            new Paragraph({
                text: "1. Executive Summary",
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
                children: [
                    new TextRun("The "),
                    new TextRun({ text: "Cloud-Based Quiz Application", bold: true }),
                    new TextRun(" is a comprehensive, full-stack web application designed to provide an interactive and engaging platform for users to test their knowledge on various cloud computing topics. Built with a modern tech stack featuring "),
                    new TextRun({ text: "React (Vite)", bold: true }),
                    new TextRun(" for the frontend and "),
                    new TextRun({ text: "Node.js/Express", bold: true }),
                    new TextRun(" with "),
                    new TextRun({ text: "Supabase", bold: true }),
                    new TextRun(" for the backend, the application offers a seamless user experience with real-time data, responsive design, and a robust administrative panel."),
                ],
                spacing: { after: 200 },
            }),

            // 2. Key Features
            new Paragraph({
                text: "2. Key Features",
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
                text: "2.1 User Features",
                heading: HeadingLevel.HEADING_2,
                spacing: { after: 100 },
            }),
            new Paragraph({ text: "• Interactive Home Page: A visually stunning landing page with animated backgrounds and a live global leaderboard.", bullet: { level: 0 } }),
            new Paragraph({ text: "• User Authentication: Secure signup and login functionality powered by Supabase Auth.", bullet: { level: 0 } }),
            new Paragraph({ text: "• Dashboard: A personalized dashboard showing available quizzes, recent activity, and progress.", bullet: { level: 0 } }),
            new Paragraph({ text: "• Quiz Interface: A dynamic quiz taking experience with timer, instant feedback, and progress tracking.", bullet: { level: 0 } }),
            new Paragraph({ text: "• Real-time Leaderboard: A global leaderboard showcasing top performers with dark mode aesthetics.", bullet: { level: 0 } }),
            new Paragraph({ text: "• Responsive Design: Fully optimized for desktop, tablet, and mobile devices.", bullet: { level: 0 } }),

            new Paragraph({
                text: "2.2 Admin Features",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 100, after: 100 },
            }),
            new Paragraph({ text: "• Dashboard Overview: Real-time analytics on users, quizzes, and attempts.", bullet: { level: 0 } }),
            new Paragraph({ text: "• Quiz Management: Create, update, and delete quizzes and questions.", bullet: { level: 0 } }),
            new Paragraph({ text: "• User Management: View and manage registered users (promote to admin, ban/unban).", bullet: { level: 0 } }),
            new Paragraph({ text: "• Analytics: Detailed insights into quiz performance and user engagement.", bullet: { level: 0 } }),
            new Paragraph({ text: "• Application Settings: Configure global app settings like branding and maintenance mode.", bullet: { level: 0 } }),

            // 3. Tech Stack
            new Paragraph({
                text: "3. Technology Stack",
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 100 },
            }),
            new Paragraph({ text: "Frontend:", heading: HeadingLevel.HEADING_3 }),
            new Paragraph({ text: "• Framework: React 18 (Vite)", bullet: { level: 0 } }),
            new Paragraph({ text: "• Styling: Tailwind CSS, Framer Motion, Lucide React", bullet: { level: 0 } }),
            new Paragraph({ text: "• State Management: React Hooks", bullet: { level: 0 } }),
            new Paragraph({ text: "• Routing: React Router DOM", bullet: { level: 0 } }),

            new Paragraph({ text: "Backend:", heading: HeadingLevel.HEADING_3, spacing: { before: 100 } }),
            new Paragraph({ text: "• Runtime: Node.js", bullet: { level: 0 } }),
            new Paragraph({ text: "• Framework: Express.js", bullet: { level: 0 } }),
            new Paragraph({ text: "• Database: PostgreSQL (via Supabase)", bullet: { level: 0 } }),
            new Paragraph({ text: "• Authentication: Supabase Auth", bullet: { level: 0 } }),
            new Paragraph({ text: "• API: RESTful API endpoints", bullet: { level: 0 } }),

            // 4. Screenshots
            new Paragraph({
                text: "4. Application Screenshots",
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 100 },
            }),

            new Paragraph({
                text: "4.1 Home Page",
                heading: HeadingLevel.HEADING_2,
                spacing: { after: 100 },
            }),
            new Paragraph({
                text: "The landing page features a modern, dark-themed design with an animated background and a clear call to action.",
                spacing: { after: 100 },
            }),
            createImage(imagePaths.home),

            new Paragraph({
                text: "4.2 User Dashboard",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
                text: "Upon logging in, users are greeted with their dashboard, displaying available quizzes and their recent performance.",
                spacing: { after: 100 },
            }),
            createImage(imagePaths.dashboard),

            new Paragraph({
                text: "4.3 Quiz Interface",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
                text: "The quiz interface is designed for focus, with a clean layout, timer, and clear option selection.",
                spacing: { after: 100 },
            }),
            createImage(imagePaths.quiz),

            new Paragraph({
                text: "4.4 Admin Dashboard",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
                text: "(Note: Admin features are accessible to users with the 'admin' role, providing comprehensive management tools.)",
                spacing: { after: 100 },
            }),
            createImage(imagePaths.admin),

            // 5. Conclusion
            new Paragraph({
                text: "5. Conclusion",
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
                text: "The Cloud-Based Quiz Application successfully meets the objectives of providing a robust, scalable, and engaging platform for learning and assessment. The integration of real-time data, modern UI/UX principles, and a secure backend ensures a high-quality experience for both users and administrators.",
            }),
        ],
    }],
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("C:/Users/dell/Desktop/coulde/Project_Report.docx", buffer);
    console.log("Document created successfully at C:/Users/dell/Desktop/coulde/Project_Report.docx");
});
