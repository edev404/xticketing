import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { AuthAntifraudeService } from '../auth-antifraude/services/auth-antifraude.service';

@Injectable({
  providedIn: 'root'
})
export class GuardAntifraudeGuard implements CanActivate, CanActivateChild {
  
  // Variable para validar si el login se hizo éxitosamente
  loginAntifraudeSuccess: boolean = false;

  constructor(private authAntifraudeService: AuthAntifraudeService, private router: Router) { 
    // Se Subscribe para ingresar en el modulo antifraude en caso de login éxitoso.
    this.authAntifraudeService.antifraudeSubjectBehavior.subscribe((antifraudeSubject: boolean) => this.loginAntifraudeSuccess = antifraudeSubject);
  }

  canActivate(): boolean {
    if (!this.loginAntifraudeSuccess) {
      this.router.navigateByUrl('/main/antifraude');
      return false;
    }
    return true;
  }

  canActivateChild(): boolean {
    if (!this.loginAntifraudeSuccess){
      this.router.navigateByUrl('/main/antifraude');
      return false;
    }
    return true;
  }
  
}
