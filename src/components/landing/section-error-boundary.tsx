"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  name: string;
}

interface State {
  error: Error | null;
}

export class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[SectionErrorBoundary:${this.props.name}]`, error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="relative border border-red-500/20 bg-red-500/5 p-6 text-center">
          <p className="text-sm font-medium text-red-400">
            Error in section: {this.props.name}
          </p>
          <p className="mt-1 text-xs text-red-300/60">
            {this.state.error.message}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
