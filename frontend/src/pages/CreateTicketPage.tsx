export function CreateTicketPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Create New Ticket</h1>
      </div>
      
      <div className="bg-white rounded-lg border border-border p-8 text-center">
        <h2 className="text-xl font-semibold text-muted-foreground mb-2">
          Create Ticket Form Coming Soon
        </h2>
        <p className="text-muted-foreground mb-4">
          This page will contain a form to create new support tickets.
        </p>
        <p className="text-sm text-muted-foreground">
          Will include fields for title, description, priority, and form validation.
        </p>
      </div>
    </div>
  );
}