import { ThemeProvider } from '@material-ui/core/styles';
import { globalHistory } from '@reach/router';
import { QueryParamProvider } from 'use-query-params';
import { AbilityProvider } from '../../store/ability/context';
import { AuthProvider } from '../../store/auth/context';
import { ThemeProvider as UserControllableThemeProvider } from '../../store/theme/context';
import theme from "../../theme";
import { HelmetProvider } from "react-helmet-async"

const ProviderWrapper = ({ children }: any) => {
    return (
        <HelmetProvider>
            <AuthProvider>
                <AbilityProvider>
                    <UserControllableThemeProvider>
                        <ThemeProvider theme={theme}>
                            <QueryParamProvider reachHistory={globalHistory}>
                                {children}
                            </QueryParamProvider>
                        </ThemeProvider>
                    </UserControllableThemeProvider>
                </AbilityProvider>
            </AuthProvider>
        </HelmetProvider>
    )
}

export default ProviderWrapper
