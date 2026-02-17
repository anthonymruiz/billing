import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router'; 

export const adminGuard: CanMatchFn = () => {
 
 
  return true;
};
