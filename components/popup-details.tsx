import Link from "next/link";
import Button from "react-bootstrap/Button";

export default function PopupDetails({
  id,
  address,
}: {
  id: string;
  address: string;
}) {
  return (
    <>
      <h4>{id}</h4>
      <p>{address}</p>

      <div className="d-grid gap-2">
        <Link href={`/restaurants?id=${id}`} passHref>
          <Button variant="dark" size="lg" className="text-light">
            Wybierz
          </Button>
        </Link>
      </div>
    </>
  );
}
