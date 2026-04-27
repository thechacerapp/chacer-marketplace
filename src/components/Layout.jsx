import ContactButton from '@/components/ContactButton';

export default function Layout({ children }) {
  return (
    <>
      {children}
      <ContactButton />
    </>
  );
}