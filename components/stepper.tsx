import React from "react";

interface StepperProps {
  steps: string[];
  currentStep: number; // 0-based index for the current step
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="stepper d-flex justify-content-between align-items-center mb-4">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`stepper-item d-flex flex-column align-items-center ${
            index <= currentStep ? "active" : ""
          }`}
        >
          <div className={`step-circle ${index <= currentStep ? "active-circle" : ""}`}>
            {index + 1}
          </div>
          <span className={`step-label ${index <= currentStep ? "active-label" : ""}`}>
            {step}
          </span>
        </div>
      ))}

      <style jsx>{`
        .stepper {
          border-bottom: 2px solid #dee2e6;
          padding-bottom: 10px;
        }
        .stepper-item {
          flex: 1;
          text-align: center;
        }
        .step-circle {
          width: 30px;
          height: 30px;
          border: 2px solid #dee2e6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          background-color: white;
          color: #6c757d;
          transition: 0.3s;
        }
        .step-label {
          margin-top: 8px;
          font-size: 14px;
          color: #6c757d;
        }
        .active-circle {
          background-color: #6c757d;
          color: white;
          border-color: #6c757d;
        }
        .active-label {
          font-weight: bold;
          color: #6c757d;
        }
      `}</style>
    </div>
  );
};

export default Stepper;
