import React, {useState} from "react";

export const CreatePropertyModal = ({
    basicInfo
}) => {

    const [step, setStep] = useState(1);

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
                {(step === 1 || !basicInfo.label) ? (
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
                { step === 2 && 
                    <button 
                        className="modalBackBtn" 
                        onClick={() => setStep(1)}
                    >
                        Back
                    </button>
                }
                <button className="modalCancelBtn">Cancel</button>
                {(step === 1) ? (
                    <button 
                        className="modalNextBtn" 
                        disabled={!basicInfo.label}
                        onClick={() => setStep(2)}>
                            Next
                    </button>
                ): (
                    <button 
                        className="modalCreateBtn"
                    >
                            Create
                    </button>
                )}
            </div>
        </div>
    )
};

CreatePropertyModal.defaultProps = {
    basicInfo: { label: "" }
};