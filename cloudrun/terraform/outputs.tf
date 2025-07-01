output "express_api_url" {
  value = google_cloud_run_service.express_api.status[0].url
}

output "react_app_url" {
  value = google_cloud_run_service.react_app.status[0].url
}