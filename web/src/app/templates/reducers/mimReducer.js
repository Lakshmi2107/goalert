const initialState = {
    templatesList: {},
    alertsList: [],
    alertDetails: {},
    commentsList: [],
    msTeamData: {},
    previewData: {}
}
const mimReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'TEMPLATES_LIST':
            return {
                ...state, 
                templatesList: action.payload 
            };
        case 'ALERTS_LIST':
            return {
                ...state, 
                alertsList: action.payload 
            };
        case 'ALERT_DETAILS':
            return {
                ...state, 
                alertDetails: action.payload 
            };
        case 'COMMENTS_LIST':
            return {
                ...state, 
                commentsList: action.payload 
            };    
        case 'MSTEAM_DATA': 
            return {
                ...state, 
                msTeamData: action.payload 
            };
        case 'TEMPLATE_PREVIEW': 
            return {
                ...state, 
                previewData: action.payload 
            };
        default:
            return state;
    }
};

export default mimReducer;