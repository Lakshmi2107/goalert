export const setStateObject = (onBoardForms) => {
    const stateObj = {}
    const errorObj = {}
    onBoardForms.map((obj) => {
        stateObj[obj.name] = ''
        errorObj[obj.name] = ''
    })
    stateObj.errors = errorObj
    return stateObj
}

export const updateStateObject = (formData, onBoardInfo, fieldName, fieldValue, formDetails) => {
    let updatedOnBoardInfo = {}

    updatedOnBoardInfo = {
        ...onBoardInfo,
        [fieldName]: fieldValue,
        errors: {}
    }

    if(fieldName === 'provisioningFor') {
        updatedOnBoardInfo = {
            ...updatedOnBoardInfo,
            'serviceSize': '',
            'env': 'dev',
            'applicationName': '',
            'applicationId': '',
            'applicationFullName': '',
            'groupDL': '',
            'portfolio': ''
        }
    }

    if(fieldName === 'env') {
        updatedOnBoardInfo = {
            ...updatedOnBoardInfo,
            'applicationName': ''
        }
    }


    if(formDetails.group) {
        let fieldNameIndex = fieldName.split('_')[1] - 1
        const groupObj = onBoardInfo[formDetails.group]
        /*const updatedFieldName = fieldName.split('_')[0]
        let updatedFieldValue = fieldValue
        if(updatedFieldName === "team") {
            updatedFieldValue = {
                'teamName': fieldValue
            }
        }
        console.log('groupObj[fieldNameIndex]  ', groupObj[fieldNameIndex])
        console.log('updatedFieldName ', updatedFieldName)
        console.log('updatedFieldValue ', updatedFieldValue)
        groupObj[fieldNameIndex] = {
            ...groupObj[fieldNameIndex],
            [fieldName]: updatedFieldValue
        }

        console.log('groupObj >> after >>  ', groupObj)
        
        updatedOnBoardInfo = {
            ...onBoardInfo,
            [fieldName]: fieldValue,
            //[formDetails.group]: groupObj,
            errors: {}
        }
        */

        
        //update group state value
        formData.map((opt) => {
            let rolesObj = []
            if(opt.field_type === 'group') { // check with group name
                opt.fields.map((mObj, index) => {
                    let fieldObj = {}
                    mObj.map((obj) => {
                        let fieldName = obj.name.split("_")[0]
                        if(fieldName === 'team') {
                            fieldObj[fieldName] = {
                                'teamName': updatedOnBoardInfo[obj.name]
                            }
                        } else {
                            fieldObj[fieldName] = updatedOnBoardInfo[obj.name]
                        }
                    })
                    rolesObj.push(fieldObj)
                })
                updatedOnBoardInfo = {
                    ...updatedOnBoardInfo,
                    [opt.name] : rolesObj
                    //[formDetails.group]: rolesObj,
                }
            }
        })
        
    } else {
        updatedOnBoardInfo = {
            ...updatedOnBoardInfo,
            [fieldName]: fieldValue,
            errors: {}
        }
    }
    
    return updatedOnBoardInfo
}

export const updateGroupObj = (formData, onBoardInfo) => {
    let updatedGropupObj = JSON.parse(JSON.stringify(onBoardInfo));
        //update group state value
        let rolesObj = []
        formData.map((opt) => {
            if(opt.field_type === 'group') { // check with group name
                opt.fields.map((mObj, index) => {
                    let fieldObj = {}
                    mObj.map((obj) => {
                        let fieldName = obj.name.split("_")[0]
                        if(fieldName === 'team') {
                            fieldObj[fieldName] = {
                                'teamName': onBoardInfo[obj.name]
                            }
                        } else {
                            fieldObj[fieldName] = onBoardInfo[obj.name]
                        }
                    })
                    rolesObj.push(fieldObj)
                })
                updatedGropupObj = {
                    ...updatedGropupObj,
                    [opt.name] : rolesObj
                }
            }
        })

        return updatedGropupObj
}

export const validateForm = (onBoardForms, stateValue, tokenObj) => {
    let validatedFlag = true
    let updatedStateValue = stateValue
    onBoardForms.map((opt) => {
        // check required fields
        if(opt.required && !opt.disabled) {
            if(!stateValue[opt.name] || stateValue[opt.name].toString().trim() === '') {
                updatedStateValue = {
                    ...updatedStateValue,
                    errors: {
                        ...updatedStateValue.errors,
                        [opt.name]: opt.label+" Field Required"
                    }
                }
                validatedFlag = false
            }
        } 

        //check group validation
        if(opt.field_type === 'group' && !opt.disabled) {
            opt.fields.map((groupObj) => {
                groupObj.map((groupFieldObj) => {
                    if(groupFieldObj.required && !groupFieldObj.disabled) {
                        if(stateValue[groupFieldObj.name] === '') {
                            updatedStateValue = {
                                ...updatedStateValue,
                                errors: {
                                    ...updatedStateValue.errors,
                                    [groupFieldObj.name]: groupFieldObj.label+" Field Required"
                                }
                            }
                            validatedFlag = false
                        }
                    }
                })
            })
        }

        // check specific validation
        if(stateValue[opt.name] !== '' && opt.validation) {
            if(!getSpecificValidation(opt.validation, stateValue[opt.name].toString().trim(), opt.name, stateValue[opt.schemaField], tokenObj)) {
                updatedStateValue = {
                    ...updatedStateValue,
                    errors: {
                        ...updatedStateValue.errors,
                        [opt.name]: opt.errorMsg
                    }
                }
                validatedFlag = false
            }
        }

        //Check Character Validation
        if(stateValue[opt.name] !== '' && opt.characterLimit) {
            if(stateValue[opt.name].length > opt.characterLimit) {
                updatedStateValue = {
                    ...updatedStateValue,
                    errors: {
                        ...updatedStateValue.errors,
                        [opt.name]: "Maximum character should be "+opt.characterLimit
                    }
                }
                validatedFlag = false
            }
        }

        //display none set default value
        /*if(opt.display === 'none') {
            console.info("opt >> ", opt)
            console.info("updatedStateValue >> ", updatedStateValue)
            updatedStateValue = {
                ...updatedStateValue,
                [opt.name]: opt.preSelected
            }
            console.info("updatedStateValue after >> ", updatedStateValue)
        } */

        //setstateValue(updatedStateValue)
    })

    const retValue = {
        status: validatedFlag,
        updatedStateValue: updatedStateValue
    }
    return retValue
}

export const getSpecificValidation = (validation, fieldValue, fieldName, schemaField, tokenObj) => {
    switch (validation) {
        case "email": 
            return isValidEmail(fieldValue)
        case "json": 
            return isValidJson(fieldValue)
        case "alphanumeric":
            return isAlphaNumeric(fieldValue) && isFirstCharStr(fieldValue) && maxCharacter(16, fieldValue)
        case "ldapvalidation":
            return isLDAPValidate(fieldValue)
       /* case "jsonSchema": 
            return isValidJsonSchema(fieldValue, fieldName, schemaField, tokenObj) */
        case "alphanumericUppercase":
            return isAlphaNumericUppercase(fieldValue)
        case "path": 
            return isValidPath(fieldValue)
        default:
            return false
    }
}

const isValidEmail = (mail) =>  {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
    {
        return (true)
    }
    return (false)
} 

const isAlphaNumeric = (str) =>  {   
    if (/^([a-z0-9]+)$/.test(str))
    {
        return (true)
    }
    return (false)
} 

const isAlphaNumericUppercase = (str) =>  {   
    if (/^([A-Z0-9]+)$/.test(str))
    {
        return (true)
    }
    return (false)
} 

const isFirstCharStr = (str) => {
    let re = /[a-z]/;
    let indexChar = str.charAt(0);
    if(/^([a-z]+)$/.test(indexChar)) {
        return true
    }
    return false
}

const isValidJson = (value) => {
    try {
        JSON.parse(value);
        return true;
    } catch (e) {
        return false;
    }
    return true;
}

/*const isValidJsonSchema = (filedValue, fieldName, schemaField, tokenObj) => {
    try {
        const Validator = require('jsonschema').Validator;
        const v = new Validator();
        const schema = tokenObj.globalObj[schemaField].jsonSchema[fieldName]
        if(schema) {
            const res = v.validate(JSON.parse(filedValue), schema);
            return res.valid // true or false
        }
    } catch (e) {
        return false;
    }
    return true
}*/

const maxCharacter = (char, str) =>  {
    if (str.length <= char)
    {
        return (true)
    }
    return (false)
} 

const isLDAPValidate = (value) => {
    const ldapList = ['carbon_onprem_dbaas_read_npe',
        'carbon_onprem_dbaas_write_npe',
        'carbon_onprem_dbaas_admin_npe',
        'carbon_onprem_dbaas_read_prd',
        'carbon_onprem_dbaas_write_prd',
        'carbon_onprem_dbaas_admin_prd']
    if(ldapList.indexOf(value) === -1) {
        return true
    } 
    return false
}

const isValidPath = (path) =>  {
    if (/^([a-zA-Z0-9/]+)$/.test(path))
    {
        return (true)
    }
    return (false)
} 
