import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      
      <button>
        <Link href="/session">
          Start Recording
        </Link>
      </button>
    
    </div>
  );
}
