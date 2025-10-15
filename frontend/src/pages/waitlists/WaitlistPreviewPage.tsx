import WaitlistPageTemplate from '../../components/WaitlistPageTemplate'

export default function WaitlistPreviewPage() {
  const handleSubmit = async (email: string) => {
    console.log('Submitted email:', email)
    alert(`Thank you! ${email} has been added to the waitlist.`)
  }

  return (
    <WaitlistPageTemplate
      title="Product Launch 2024"
      description="Be the first to know when we launch our revolutionary new product"
      subscriberCount={1234}
      onSubmit={handleSubmit}
    />
  )
}
