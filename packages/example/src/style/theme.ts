import {createMuiTheme} from "@material-ui/core/styles";

export const theme = createMuiTheme({
    palette: {
        type: 'dark',
        secondary: {
            main: "#6e42ca"
        },
        background: {
            default: '#14072e',
            paper: 'rgba(28,28,51,.6)'
        }
    }
});
