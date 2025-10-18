# github-web

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## Project Description 📝

This project, `github-web`, is a frontend application designed to interact with the GitHub API. While its precise functionality isn't explicitly defined in the initial description, judging from the included components and file structure, it likely aims to provide a user-friendly web interface for common GitHub tasks. It appears to offer functionalities such as file uploading, commit log viewing, and configuration management, all within a single, cohesive platform. This can simplify the workflow for developers and project managers who frequently interact with GitHub repositories.

The application is built using modern web technologies, including TypeScript, React, and Tailwind CSS. This suggests a focus on maintainability, scalability, and a visually appealing user experience. By leveraging React's component-based architecture and TypeScript's strong typing system, the project aims to create a robust and error-free application. The use of Tailwind CSS indicates an intention to provide a highly customizable and responsive design that adapts seamlessly to different screen sizes.

This project targets developers and GitHub enthusiasts who want a streamlined and intuitive way to manage their GitHub projects. Rather than relying solely on the command line or the standard GitHub website, `github-web` aims to offer a custom experience tailored to specific needs. It allows for potential customization and extension, making it a valuable tool for individuals and teams looking to optimize their GitHub workflow and increase productivity.

## Key Features ✨

*   **File Upload Section:** Allows users to upload files directly to their GitHub repository through a web interface, simplifying the process of adding new content.
*   **Commit Log Section:** Displays the commit history of a repository in a readable format, enabling users to quickly review changes and track project progress.
*   **Configuration Section:** Provides a user interface for managing repository settings and configurations, making it easier to customize project behavior.
*   **Actions Section:** Enables users to trigger GitHub Actions workflows directly from the web interface, facilitating continuous integration and deployment.
*   **Theming Support**: Offers light and dark theme options, allowing users to customize the application's appearance based on their preferences and visual comfort.
*   **Toast Notifications**: Provides user feedback through non-intrusive toast notifications for actions such as successful uploads or errors.

## Tech Stack & Tools 🛠️

| Technology      | Description                                                              |
| --------------- | ------------------------------------------------------------------------ |
| TypeScript      | Primary programming language, providing strong typing and tooling.       |
| React           | JavaScript library for building user interfaces.                         |
| Vite            | Build tool that provides fast development experience.                     |
| Tailwind CSS    | Utility-first CSS framework for rapid UI development.                      |
| ESLint          | Linter for identifying and fixing code style issues.                      |
| PostCSS         | Tool for transforming CSS with JavaScript.                              |
| `useGitHub` Hook | Custom React hook for interacting with the GitHub API.                 |
| `useTheme` Hook  | Custom React hook for managing the application's theme (light/dark).     |

## Installation & Running Locally 🚀

1.  **Prerequisites:**

    *   Node.js (version 18 or higher recommended)
    *   npm (Node Package Manager) or yarn.

2.  **Clone the repository:**

    ```bash
    git clone https://github.com/haein22/github-web.git
    ```

3.  **Navigate to the project directory:**

    ```bash
    cd github-web
    ```

4.  **Install dependencies using npm:**

    ```bash
    npm install
    ```

    *OR* **Install dependencies using yarn:**

    ```bash
    yarn install
    ```

5.  **Run the development server:**

    ```bash
    npm run dev
    ```

    *OR*

    ```bash
    yarn dev
    ```

    This will start the application in development mode. Open your browser and navigate to the address provided (usually `http://localhost:5173`).

## How to Contribute 🤝

We welcome contributions to `github-web`! To contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and ensure they are well-tested.
4.  Submit a pull request with a clear description of your changes.