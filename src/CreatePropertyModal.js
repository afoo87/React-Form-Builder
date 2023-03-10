import React from "react";

export const CreatePropertyModal = ({
    basicInfo,
    step
}) => {
    return (
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
                {(!basicInfo.label && step === 1) ? (
                    <div id="basicInfoStep">
                        <div>
                            <label htmlFor="labelInput">Label *</label>
                            <input
                                id="labelInput"
                                name="labelInput"
                                type="text"
                                value={basicInfo.label}
                                readOnly
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="fieldDescription">Description</label>
                            <input id="fieldDescription" name="fieldDescription" type="text"></input>
                        </div>
                    </div>
                ) : (
                    <>
                        <h4 className="fieldPropertyName">{basicInfo.label}</h4>
                        <div id="fieldTypeStep"></div>
                    </>
                )}
            </div>
            <div className="modalFooter">
                { step === 2 && <button className="modalBackBtn">Back</button> }
                <button className="modalCancelBtn">Cancel</button>
                <button className="modalNextBtn" disabled={!basicInfo.label}>Next</button>
            </div>
        </div>
    )
};

CreatePropertyModal.defaultProps = {
    basicInfo: { label: "" },
    step: 1
};