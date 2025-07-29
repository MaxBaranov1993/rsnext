Write-Host "Adding remote repository..." -ForegroundColor Green
git remote add origin git@github.com:MaxBaranov1993/rsnext.git

Write-Host "Setting main branch..." -ForegroundColor Green
git branch -M main

Write-Host "Pushing to GitHub..." -ForegroundColor Green
git push -u origin main

Write-Host "Done! Project pushed to GitHub successfully." -ForegroundColor Green