import { SignupForm } from './signup-form.tsx'

export function Signup() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-[400px]">
          <SignupForm />
        </div>
      </div>
      <div className="w-1/2">
        <img
          src="/images/booking.jpg"
          className="object-cover w-full h-full "
          alt=""
        />
      </div>
    </div>
  )
}
