// src/app/core/services/session.service.ts
import { Injectable } from '@angular/core';
import { supabase } from '../../supabase.client';
import { BehaviorSubject } from 'rxjs';
import {AuthError} from '@supabase/supabase-js';

export interface SessionUser {
  id: string;
  email: string;
  role_id: number;
  first_name: string;
  last_name: string;
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  private userSubject = new BehaviorSubject<SessionUser | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor() {
    this.loadSession();
    supabase.auth.onAuthStateChange(() =>{ this.loadSession()});
  }
  public get currentUser(): SessionUser | null {
    return this.userSubject.value;
  }
  async loadSession(): Promise<void> {
    const {
      data: { session }
    } = await supabase.auth.getSession();

    const userId = session?.user?.id;
    if (!userId) {
      this.userSubject.next(null);
      return;
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      this.userSubject.next(null);
      return;
    }

    this.userSubject.next(data as SessionUser);
  }

  logout(): Promise<{ error: AuthError | null }> {
    this.userSubject.next(null);
    return supabase.auth.signOut();
  }

}
