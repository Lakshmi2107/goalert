const initialState = {
    loaderStatus: false,
    notification: {},
    paasOptions: [],
    checkAvailability: {},
    invalidTokenObj: {}
}
const commonReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOADER_STATUS':
            return {
                ...state, 
                loaderStatus: action.status 
            };
        case 'PAAS_NOTIFICATION':
            return {
                ...state, 
                notification: action.payload 
            };
        case 'PAAS_OPTIONS':
                let updatedPayload = []
                let updatedStateValue = JSON.parse(JSON.stringify(state.paasOptions));
                const fieldObj = _.find(updatedStateValue,(n) => { return n.name === action.refFields.name } )
                if(!fieldObj && action.payload) {
                    action.payload.map((opt) => {
                        const obj = {
                            label: opt.name,
                            value: opt.id,
                            values: opt.value
                        }
                        updatedPayload.push(obj)
                    })
                    const mockData = {
                        name: action.refFields.name,
                        options: updatedPayload
                    }
                    updatedStateValue.push(mockData)
                }
            return {
                ...state, 
                //paasOptions: action.payload 
                paasOptions: updatedStateValue
            };
        case 'PAAS_OPTIONS_REMOVE':
            return {
                ...state, 
                paasOptions: []
            };
        case 'CHECK_AVAILABILITY':
            if(action.payload.exists) {
                const checkAvailability = {
                    [action.refFields.name] : "Name already taken. Try again with a different name"
                }
                return {
                    ...state,
                    checkAvailability: checkAvailability
                }
            }
            return state
            
        case 'CHECK_AVAILABILITY_REMOVE':
            return {
                ...state, 
                checkAvailability: {}
            };
        case 'INVALID_TOKEN':
            return {
                ...state,
                invalidTokenObj: action.payload
            }
        default:
            return state;
    }
};

export default commonReducer;