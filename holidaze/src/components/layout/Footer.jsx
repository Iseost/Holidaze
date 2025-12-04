export default function Footer() {
  return (
    <footer className="rounded-t-mg shadow-[inset_0_-4px_10px_rgba(0,0,0,0.25)] p-4 mt-20 text-[var(--text-sub)] bg-[var(--bg-header)]">
      <div className="container mx-auto text-center">
        &copy; {new Date().getFullYear()} Holidaze. All rights reserved.
      </div>
    </footer>
  );
}
