import LeafletMap from "@/components/maps/LeafletMap";
import Container from "@/components/ui/Container";

function page() {
    return (
        <Container>
            <div className="absolute inset-0 top-[5rem] overflow-hidden">
                <LeafletMap />
            </div>
        </Container>
    );
}

export default page;
