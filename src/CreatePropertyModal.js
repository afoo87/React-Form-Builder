import React from "react";

export const CreatePropertyModal = () => (
    <div>
        <div className="modalHeader">
            <div>Create a new property</div>
        </div>
        <hr></hr>
        <div className="modalContent">
            <div className="stepIndicator">
                <div className="stepIndicatorSection active">
                    <span className="stepIndicatorPoint"></span>
                    <span className="stepIndicatorText">Basic Info</span>
                </div>
                <div className="stepIndicatorSection">
                    <span className="stepIndicatorPoint"></span>
                    <span className="stepIndicatorText">Field Type</span>
                </div>
            </div>
            <div>
                <label for="labelInput">Label *</label>
                <input id="labelInput" name="labelInput" type="text"></input>
            </div>
            <div>
                <label for="fieldDescription">Description</label>
                <input id="fieldDescription" name="fieldDescription" type="text"></input>
            </div>
        </div>
        <div className="modalFooter">
            <button className="modalCancelBtn">Cancel</button>
            <button className="modalNextBtn">Next</button>
        </div>
    </div>
);