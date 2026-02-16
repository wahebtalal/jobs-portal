export default function AdminLoginPage() {
  return (
    <main className="container-page py-16">
      <div className="max-w-md mx-auto card p-6">
        <h1 className="text-xl font-bold mb-4">Admin Login</h1>
        <form action="/api/admin/login" method="POST" className="space-y-3">
          <input className="input" name="username" placeholder="Username" required />
          <input className="input" name="password" placeholder="Password" type="password" required />
          <button className="btn btn-primary w-full">Login</button>
        </form>
      </div>
    </main>
  );
}
