import { AuthProvider } from "./auth-provider";
import { ThemeProvider } from "./theme-provider";

function Providers({ children }: React.PropsWithChildren) {
    return (
        <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                {children}
            </ThemeProvider>
        </AuthProvider>
    );
}

export default Providers;
