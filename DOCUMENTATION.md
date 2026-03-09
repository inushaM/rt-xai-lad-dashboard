# RT-XAI-LAD Dashboard - User Guide

**Frontend Documentation for Educators**

This guide explains how to use the RT-XAI-LAD Dashboard to identify and support at-risk students.

---

## Quick Start

1. **Open the Dashboard**: Navigate to `http://localhost:5173` in your browser
2. **Review Dashboard**: Check the overview page for summary statistics
3. **Explore Students**: Browse and filter students to find at-risk individuals
4. **View Details**: Click on students to see predictions and explanations
5. **Take Action**: Use insights to support students

---

## Dashboard Pages

### 1. Dashboard Overview

**Location**: Home page (`/`)

**What you'll see:**
- **Summary Cards**: Total students, at-risk count, average risk, high-risk count
- **Risk Distribution Chart**: Visual breakdown of low/medium/high risk students
- **Module Breakdown**: Risk statistics by course module
- **Presentation Breakdown**: Risk statistics by presentation period
- **High-Risk Students Table**: Top 10 students needing immediate attention

**How to use:**
- Monitor overall student health
- Identify trends across modules
- Quickly find students needing intervention
- Click on high-risk students to view details

---

### 2. Students Page

**Location**: `/students`

**What you'll see:**
- **Filter Options**: Module, Presentation, Risk Level dropdowns
- **Student Table**: List of all students with their risk predictions
- **Pagination**: Navigate through large student lists

**How to use:**
1. **Filter Students**:
   - Select a module to see only students in that course
   - Select a presentation to see students from a specific term
   - Select a risk level to focus on low/medium/high risk students

2. **View Student Details**:
   - Click any row in the table
   - You'll be taken to the student detail page

3. **Navigate Pages**:
   - Use pagination controls at the bottom
   - Adjust rows per page (10, 25, 50, 100)

---

### 3. Student Detail Page

**Location**: `/students/:studentId`

**What you'll see:**
- **Student Information**: Demographics, course details, academic metrics
- **Risk Prediction**: Probability, risk level, and prediction status
- **LIME Explanation**: Interpretable explanation of the prediction

**How to use:**
1. **Review Student Info**: Understand the student's background
2. **Check Risk Level**: See the predicted risk probability and level
3. **Generate Explanation**: Click "Generate Explanation" button
4. **Understand Factors**: Review which features increase/decrease risk
5. **Take Action**: Use insights to provide targeted support

**Understanding the Explanation:**
- **Factors Increasing Risk**: Features that make the student more likely to be at risk
- **Factors Decreasing Risk**: Features that reduce the risk
- **Plain English Text**: Summary explanation of the prediction

---

### 4. Global Explainability Page

**Location**: `/explanations`

**What you'll see:**
- **Feature Importance Chart**: Bar chart showing most important features globally
- **Feature Descriptions**: What each feature means
- **Summary Explanation**: Overall interpretation

**How to use:**
1. **Understand Model Behavior**: See what the model considers important
2. **Review Top Features**: Identify which student characteristics matter most
3. **Read Descriptions**: Learn what each feature represents
4. **Apply Insights**: Use knowledge to focus on important metrics

**Key Insights:**
- Features with higher importance have more impact on predictions
- Understanding these helps you know what to monitor
- Use insights to guide student support strategies

---

### 5. Model Metrics Page

**Location**: `/metrics`

**What you'll see:**
- **Performance Metrics**: Accuracy, ROC-AUC scores
- **Classification Report**: Detailed performance breakdown

**How to use:**
1. **Assess Model Quality**: Check accuracy and AUC metrics
2. **Review Performance**: Understand how well the model performs
3. **Build Confidence**: Use metrics to trust predictions

**Understanding Metrics:**
- **Accuracy**: Percentage of correct predictions
- **ROC-AUC**: Model's ability to distinguish between at-risk and not at-risk
- **Higher values**: Better model performance

---

### 6. Predict Page

**Location**: `/predict`

**What you'll see:**
- **Input Form**: Fields for all student features
- **Prediction Result**: Risk probability and level
- **LIME Explanation**: Automatic explanation after prediction

**How to use:**
1. **Enter Student Data**: Fill in the form with student information
2. **Click Predict**: Get instant risk prediction
3. **Review Results**: See probability and risk level
4. **Read Explanation**: Understand why the prediction was made
5. **Test Scenarios**: Try different values to see impact

**Use Cases:**
- Predict risk for new students
- Test "what-if" scenarios
- Understand how features affect predictions
- Validate predictions for specific cases

---

## Understanding Risk Levels

### Color Coding

- 🟢 **Green (Low Risk)**: Probability < 40%
  - Student is likely to succeed
  - Monitor but no immediate action needed

- 🟠 **Orange (Medium Risk)**: 40% ≤ Probability < 70%
  - Student may need support
  - Consider intervention strategies

- 🔴 **Red (High Risk)**: Probability ≥ 70%
  - Student needs immediate attention
  - Prioritize for intervention

### Risk Probability

The percentage shown represents the model's confidence:
- **0-40%**: Low risk
- **40-70%**: Medium risk
- **70-100%**: High risk

---

## Best Practices

### For Educators

1. **Regular Monitoring**:
   - Check dashboard daily or weekly
   - Monitor high-risk students closely
   - Track trends over time

2. **Proactive Intervention**:
   - Reach out to high-risk students early
   - Use explanations to understand specific issues
   - Provide targeted support based on risk factors

3. **Data-Driven Decisions**:
   - Use predictions to prioritize students
   - Combine with your professional judgment
   - Track intervention effectiveness

4. **Understanding Explanations**:
   - Review LIME explanations for individual students
   - Check global SHAP to understand model behavior
   - Use insights to guide support strategies

### Interpreting Results

1. **Risk Probability**: Higher = more likely to be at risk
2. **Risk Level**: Color-coded for quick identification
3. **Explanations**: Show which factors contribute to risk
4. **Context**: Combine predictions with your knowledge of students

---

## Common Tasks

### Finding At-Risk Students

1. Go to **Dashboard** → Check "High Risk" count
2. Go to **Students** → Filter by "High Risk"
3. Review the table and click on students

### Understanding Why a Student is At Risk

1. Go to **Students** → Find the student
2. Click on the student row
3. Click "Generate Explanation"
4. Review factors increasing risk

### Monitoring a Specific Module

1. Go to **Dashboard** → Check module breakdown chart
2. Go to **Students** → Filter by module
3. Review risk distribution for that module

### Testing a Prediction Scenario

1. Go to **Predict** page
2. Enter student feature values
3. Click "Predict Risk"
4. Review prediction and explanation

---

## Tips & Tricks

### Keyboard Shortcuts

- Use browser back button to navigate
- Use browser search (Cmd/Ctrl+F) to find students
- Use pagination to navigate large lists

### Filtering Tips

- Combine filters for precise results
- Clear filters to see all students
- Use risk level filter to focus on priorities

### Explanation Tips

- Generate explanations for multiple students to compare
- Look for common factors in high-risk students
- Use explanations to guide intervention strategies

---

## Troubleshooting

### Page Not Loading

- Check if backend is running (should be on port 5001)
- Refresh the page
- Check browser console for errors

### No Data Showing

- Verify backend API is responding
- Check network tab in browser dev tools
- Ensure database connection is working

### Explanation Not Generating

- Wait a few seconds (explanations take time to compute)
- Check if student data is complete
- Try refreshing the page

---

## Getting Help

If you encounter issues:
1. Check this documentation
2. Review error messages
3. Contact your system administrator
4. Check backend logs for detailed errors

---

**Remember**: The predictions are tools to support your judgment, not replacements for professional assessment. Always combine model predictions with your knowledge of students.

---

**Last Updated**: March 2026
