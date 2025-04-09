// toast.js

function toast({ title = "Notice", description = "", type = "info" }) {
    const toastContainerId = 'toastContainer';
    let container = document.getElementById(toastContainerId);
  
    // Create container if not present
    if (!container) {
      container = document.createElement('div');
      container.id = toastContainerId;
      container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      document.body.appendChild(container);
    }
  
    // Determine background class based on type
    const typeClass = {
      success: 'bg-success text-white',
      error: 'bg-danger text-white',
      warning: 'bg-warning text-dark',
      info: 'bg-primary text-white',
    }[type] || 'bg-secondary text-white';
  
    // Create toast
    const toastElement = document.createElement('div');
    toastElement.className = `toast ${typeClass}`;
    toastElement.role = 'alert';
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');
  
    toastElement.innerHTML = `
      <div class="toast-header ${type === 'warning' ? 'text-dark' : 'text-white'} ${typeClass}">
        <strong class="me-auto">${title}</strong>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        ${description}
      </div>
    `;
  
    container.appendChild(toastElement);
  
    const bootstrapToast = new bootstrap.Toast(toastElement);
    bootstrapToast.show();
  
    toastElement.addEventListener('hidden.bs.toast', () => {
      toastElement.remove();
    });
  }
  