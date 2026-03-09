# RT-XAI-LAD Dashboard

Real-Time Explainable Learning Analytics Dashboard - Frontend

## Overview

A modern React dashboard for educators to view student risk predictions, model explanations, and analytics. Built with React, Material-UI, and Recharts.

## Features

- **Dashboard Overview**: Summary statistics, risk distribution charts, and high-risk student alerts
- **Student Management**: Browse, search, and filter students by module, presentation, and risk level
- **Student Details**: View individual student predictions with LIME explanations
- **Global Explainability**: SHAP feature importance visualization
- **Model Metrics**: View training performance metrics
- **Manual Prediction**: Enter student features to get predictions and explanations

## Tech Stack

- React 18
- Vite
- Material-UI (MUI) 5
- React Router 6
- Redux Toolkit
- Axios
- Recharts

## Project Structure

```
rt-xai-lad-dashboard/
├── src/
│   ├── api/              # API client and endpoints
│   ├── app/              # Redux store and slices
│   ├── components/       # Reusable components
│   │   ├── common/       # Common UI components
│   │   ├── dashboard/    # Dashboard-specific components
│   │   ├── explanations/ # Explanation components
│   │   └── layout/       # Layout components
│   ├── pages/            # Page components
│   ├── theme/            # MUI theme configuration
│   ├── utils/            # Utility functions
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
├── vite.config.js
├── .env.example
└── README.md
```

## Setup

### Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running (see rt-xai-lad-api README)

### Installation

```bash
# Install dependencies
npm install

# Or with yarn
yarn install
```

### Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your API URL:

```env
VITE_API_BASE_URL=http://localhost:5000
```

### Development

```bash
# Start development server
npm run dev

# Or with yarn
yarn dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Pages

### Dashboard (`/`)
- Overview metrics (total students, at-risk count, average risk)
- Risk distribution pie chart
- Module and presentation breakdown charts
- High-risk students table

### Students (`/students`)
- Filterable student table
- Search by module, presentation, risk level
- Click row to view student details

### Student Detail (`/students/:studentId`)
- Student information
- Risk prediction with probability
- LIME explanation (on-demand)

### Global Explainability (`/explanations`)
- SHAP global feature importance bar chart
- Feature descriptions and explanations

### Model Metrics (`/metrics`)
- Training accuracy, test accuracy
- ROC-AUC scores
- Classification report

### Predict (`/predict`)
- Manual prediction form
- Enter student features
- Get prediction and LIME explanation

## API Integration

The frontend communicates with the backend API through:

- `src/api/client.js` - Axios client configuration
- `src/api/dashboardApi.js` - API endpoint functions

All API calls return data in the format:
```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

## State Management

Redux Toolkit is used for:
- Dashboard summary data
- Student list and current student
- Loading and error states

See `src/app/store.js` and `src/app/slices/` for details.

## Styling

- Material-UI theme configured in `src/theme/theme.js`
- Responsive design with MUI breakpoints
- Professional academic dashboard aesthetic

## Risk Levels

- **Low Risk**: Probability < 0.4 (Green)
- **Medium Risk**: 0.4 ≤ Probability < 0.7 (Orange)
- **High Risk**: Probability ≥ 0.7 (Red)

## Development Notes

- Uses React Router for navigation
- Responsive sidebar navigation
- Loading and error states on all pages
- Consistent API error handling
- Recharts for data visualization

## Troubleshooting

### CORS Errors
- Ensure backend CORS is configured for `http://localhost:5173`
- Check `FRONTEND_ORIGIN` in backend `.env`

### API Connection Issues
- Verify backend is running on port 5000
- Check `VITE_API_BASE_URL` in `.env`
- Check browser console for errors

### Build Issues
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (16+ required)

## License

Academic/Research Use
