import { Injectable } from '@angular/core';
import {supabase} from '../../supabase.client';
import {AuthResult, LoginPayload, RegisterPayload, UserProfile} from '../interfaces/auth.interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {
  async registerUser(payload: RegisterPayload): Promise<AuthResult> {
    const { email, password, ...metadata } = payload;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });

    if (error) return { error: error.message };
    return { userId: data.user?.id };
  }

  async insertUserProfile({userId, profile}: { userId: string, profile: UserProfile }): Promise<{ error?: string }> {
    const { error } = await supabase.from('users').insert({
      id: userId,
      ...profile
    });

    if (error) return { error: error.message };
    return {};
  }
  async loginUser(payload: LoginPayload): Promise<AuthResult> {
    const { email, password } = payload;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error('Supabase login error:', error.message);
        return { error: error.message };
      }

      console.log('Login successful:', data.user?.id);
      return { userId: data.user?.id };
    } catch (err: any) {
      console.error('Unexpected login failure:', err);
      return { error: 'Unexpected error during login.' };
    }
  }

}
