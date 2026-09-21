import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Istenbat Farm App:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          backgroundColor: '#F9F6F0',
          color: '#1C3322',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
            مزرعة بيت الاستنبات
          </h2>
          <p style={{ color: '#4A5B4F', marginBottom: '20px', maxWidth: '420px', lineHeight: 1.6 }}>
            حدث خطأ غير متوقع أثناء تحميل الصفحة. يرجى إعادة تحديث الصفحة أو العودة للصفحة الرئيسية.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => {
                window.location.hash = '#/home';
                window.location.reload();
              }}
              style={{
                backgroundColor: '#1C3322',
                color: '#ffffff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '9999px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              إعادة التحميل
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
