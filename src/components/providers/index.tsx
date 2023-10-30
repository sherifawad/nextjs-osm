import { ThemeProvider } from "./theme-provider";

function Providers({ children }: React.PropsWithChildren) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
        </ThemeProvider>
    );
}

export default Providers;
